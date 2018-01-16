import RBAC from './rbac'

describe('Role Check', function () {
    it('should check a direct role with action', async () => {
        const rbac = new RBAC({
            rules: [
                { a: 'user', canDo: 'say hello' }
            ]
        });
        const res = await rbac.can('user', 'say hello');
        expect(res).toBe(true);
    })

    it('should fail check a direct role with action', async () => {
        const rbac = new RBAC({
            rules: [
                { a: 'user', canDo: 'say hello' }
            ]
        });
        const res = await rbac.can('user', 'say goodbye');
        expect(res).toBe(false);
    });

    it('should check an inherited role with action', async () => {
        const rbac = new RBAC({
            rules: [
                { a: 'user', canDo: 'say hello' },
                { a: 'admin', canBe: 'user' }
            ]
        })
        const res = await rbac.can('admin', 'say hello')
        expect(res).toBe(true);
    })

    it('should fail check an inherited role with action', async () => {
        const rbac = new RBAC({
            rules: [
                { a: 'user', canDo: 'say hello' },
                { a: 'admin', canBe: 'user' }
            ]
        });
        const res = await rbac.can('admin', 'say goodbye');
        expect(res).toBe(false)
    })

    it('should check an multi-inherited role with action', async () => {
        const rbac = new RBAC({
            rules: [
                { a: 'user', canDo: 'say hello' },
                { a: 'editor', canBe: 'user' },
                { a: 'admin', canBe: 'editor' }
            ]
        });
        const res = await rbac.can('admin', 'say hello');
        expect(res).toBe(true);
    });

    it('should check an multi-inherited role with action via a list of roles', async () => {
        const rbac = new RBAC({
            rules: [
                { a: 'user', canDo: 'say hello' },
                { a: 'editor', canBe: 'user' },
                { a: 'admin', canBe: 'editor' }
            ]
        });
        const res = await rbac.can(['user', 'admin'], 'say hello');
        expect(res).toBe(true);
    })

    it('should check a role with conditional action', async () => {
        const rbac = new RBAC({
            rules: [
                {
                    a: 'user', canDo: 'say hello', when: function sayHelloWhen() {
                        return Promise.resolve(true)
                    }
                }
            ]
        });
        const res = await rbac.can('user', 'say hello');
        expect(res).toBe(true);
    })

    it('should fail check a role with conditional action', async () => {
        const rbac = new RBAC({
            rules: [
                {
                    a: 'user', canDo: 'say hello', when: await function sayHelloWhen() {
                        return Promise.resolve(false)
                    }
                }
            ]
        });
        const res = await rbac.can('user', 'say hello');
        expect(res).toBe(false);
    });

    it('should check a role with conditional action and parameters', async () => {
        const rbac = new RBAC({
            rules: [
                {
                    a: 'user', canDo: 'say hello', when: function sayHelloWhen(params = {}) {
                        return params.world
                    }
                }
            ]
        });
        const res = await rbac.can('user', 'say hello', { world: true });
        expect(res).toBe(true);
    })

    it('should fail check a role with conditional action and parameters', async () => {
        const rbac = new RBAC({
            rules: [
                {
                    a: 'user', canDo: 'say hello', when: function sayHelloWhen(params = {}) {
                        return params.world
                    }
                }
            ]
        });
        const res = await rbac.can('user', 'say hello', { world: false });
        expect(res).toBe(false);
    });

})