import assert from 'assert';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { getSystemUserProfile } from '/imports/libs/getUser';
import { userprofileServerApi } from '/imports/modules/userprofile/api/userProfileServerApi';

describe('userprofile signup pipeline (server)', function () {
	if (!Meteor.isServer) return;

	const context = { user: getSystemUserProfile() as any };

	it('creates a user even when verification email fails', async () => {
		const originalSendVerificationEmail = Accounts.sendVerificationEmail;
		let userId: string | null = null;

		// Force the email step to fail to validate the fallback path.
		(Accounts as any).sendVerificationEmail = () => {
			throw new Meteor.Error('mail-error', 'SMTP unavailable');
		};

		const email = `new-user-${Random.id(5)}@example.com`;
		const password = '123456';

		try {
			userId = (await userprofileServerApi.serverInsert(
				{ email, username: email, password } as any,
				context
			)) as string;

			const profile = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: userId });
			const meteorUser = await Meteor.users.findOneAsync({ _id: userId });

			assert.ok(profile, 'userprofile should be persisted');
			assert.ok(meteorUser, 'Meteor user should be created');
			assert.strictEqual(meteorUser?.emails?.[0]?.address, email);
			assert.strictEqual(meteorUser?.emails?.[0]?.verified, true, 'email must be marked as verified');
		} finally {
			(Accounts as any).sendVerificationEmail = originalSendVerificationEmail;
			if (userId) {
				await Meteor.users.removeAsync({ _id: userId });
				await userprofileServerApi.getCollectionInstance().removeAsync({ _id: userId });
			}
		}
	});
});
