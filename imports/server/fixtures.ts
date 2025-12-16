import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { userprofileServerApi } from '../modules/userprofile/api/userProfileServerApi';

async function createDefaultUser() {
	// if (Meteor.isDevelopment && Meteor.users.find().count() === 0) {
	const count = await Meteor.users.find({}).countAsync();
	if ((await Meteor.users.find({}).countAsync()) === 0) {
		let createdUserId = '';
		createdUserId = await Accounts.createUserAsync({
			username: 'Administrador',
			email: 'admin@mrb.com',
			password: '123'
		});


		await Meteor.users.upsertAsync(
			{ _id: createdUserId },
			{
				$set: {
					'emails.0.verified': true,
					profile: {
						name: 'Admin',
						email: 'admin@mrb.com'
					}
				}
			}
		);

		await userprofileServerApi.getCollectionInstance().insertAsync({
			_id: createdUserId,
			username: 'Administrador',
			email: 'admin@mrb.com',
			roles: ['Administrador']
		});
	}
}

async function ensureTesterUser() {
	const existingTester = await Meteor.users.findOneAsync({ username: 'Tester' });
	if (existingTester) return;

	const testerId = await Accounts.createUserAsync({
		username: 'Tester',
		email: 'tester@example.com',
		password: '123',
		profile: {
			name: 'Tester QA',
			email: 'tester@example.com'
		}
	});

	await Meteor.users.upsertAsync(
		{ _id: testerId },
		{
			$set: {
				'emails.0.verified': true,
				roles: ['Administrador'],
				profile: {
					name: 'Tester QA',
					email: 'tester@example.com'
				}
			}
		}
	);

	// Ensure userprofile has the same _id as the Meteor user for permission checks
	const existingProfile = await userprofileServerApi.getCollectionInstance().findOneAsync({ email: 'tester@example.com' });
	if (existingProfile && existingProfile._id !== testerId) {
		await userprofileServerApi.getCollectionInstance().removeAsync({ _id: existingProfile._id });
	}

	await userprofileServerApi.getCollectionInstance().upsertAsync(
		{ _id: testerId },
		{
			$set: {
				username: 'Tester',
				email: 'tester@example.com',
				roles: ['Administrador'],
				userId: testerId,
				name: 'Tester QA'
			}
		}
	);
}

// if the database is empty on server start, create some sample data.
Meteor.startup(async () => {
	console.log('fixtures Meteor.startup');
	// Add default admin account
	await createDefaultUser();
	// Ensure tester account exists for QA purposes
	await ensureTesterUser();
});
