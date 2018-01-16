import rbac from './rbac';

const grant={
	rules: [
		{ a: 'reader', canDo: 'user/change_password' },
		{ a: 'publusher', canBe: 'reader' },

		{ a: 'admin', canBe: 'reader' },
		{ a: 'admin', canDo: 'user/delete_user' }
	]
};

export default new rbac(grant);