import assert from 'assert';
import { Meteor } from 'meteor/meteor';
import { getSystemUserProfile } from '/imports/libs/getUser';
import { tasksServerApi } from '/imports/modules/toDos/api/toDosServerApi';
import { ITask } from '/imports/modules/toDos/api/toDosSch';

// Server-only CRUD coverage for the ToDos module using the server API directly.
describe('toDos module CRUD (server)', function () {
	if (!Meteor.isServer) return;

	const context = { user: getSystemUserProfile() as any };

	beforeEach(async () => {
		await tasksServerApi.getCollectionInstance().removeAsync({});
	});

	it('creates a task with required fields', async () => {
		const _id = await tasksServerApi.serverInsert({ title: 'Test task', description: 'Desc' } as Partial<ITask>, context);
		assert.ok(_id, 'should return an id on insert');

		const stored = await tasksServerApi.getCollectionInstance().findOneAsync({ _id });
		assert.strictEqual(stored?.title, 'Test task');
		assert.strictEqual(stored?.status, 'pending');
	});

	it('rejects creation without title', async () => {
		let threw = false;
		try {
			await tasksServerApi.serverInsert({ description: 'Missing title' } as Partial<ITask>, context);
		} catch (e: any) {
			threw = true;
			assert.strictEqual(e.error, 'Obrigatoriedade');
		}
		assert.ok(threw, 'insert without title should throw');
	});

	it('updates a task status', async () => {
		const _id = await tasksServerApi.serverInsert({ title: 'Toggle status' } as Partial<ITask>, context);
		await tasksServerApi.serverUpdate({ _id, status: 'completed', title: 'Toggle status' } as Partial<ITask>, context);

		const stored = await tasksServerApi.getCollectionInstance().findOneAsync({ _id });
		assert.strictEqual(stored?.status, 'completed');
	});

	it('removes a task', async () => {
		const _id = await tasksServerApi.serverInsert({ title: 'Remove me' } as Partial<ITask>, context);
		await tasksServerApi.serverRemove({ _id } as Partial<ITask>, context);

		const stored = await tasksServerApi.getCollectionInstance().findOneAsync({ _id });
		assert.strictEqual(stored, undefined);
	});
});
