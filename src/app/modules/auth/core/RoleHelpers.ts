import { getThingPermissions } from '../../things/api/ThingAPI';
import { getChannelPermissions } from '../../channels/api/ChannelsAPI';
import { getGroupPermissions } from '../../groups/api/GroupAPI';

const ROLE_LOCAL_STORAGE_KEY = 'rapid-role'

const MODULENAME = {
    INVITATION: 'Invitation',
    ORGANIZATIONINVITATION: 'OrganizationInvitation',
    ORGANIZATIONINFO: 'OrganizationInfo',
    MEMBERLIST: 'MemberList',
    USERSLIST: 'UsersList',
    DEVICELIST: 'DeviceList',
    DEVICECONNECT: 'DeviceConnect',
    ASSETLIST: 'AssetList',
    ASSETGROUP: 'AssetGroup',
    ASSETMEMBER: 'AssetMember',
    ASSETCONNECT: 'AssetConnect',
    ASSETGROUPLIST: 'AssetGroupList',
    ASSETGROUPMEMBER: 'AssetGroupMember',
}

const MODULE = {
    INVITATION: {
        VIEW: 'Invitation.view',
        CREATE: 'Invitation.create',
        UPDATE: 'Invitation.update',
        DELETE: 'Invitation.delete',
    },
    ORGANIZATIONINVITATION: {
        MENU: 'OrganizationInvitation.menu',
    },
    ORGANIZATIONINFO: {
        DISABLE: 'OrganizationInfo.disable',
        UPDATE: 'OrganizationInfo.update',
    },
    MEMBERLIST: {
        CREATE: 'MemberList.create',
    },
    USERSLIST: {
        VIEW: 'UsersList.view',
        CREATE: 'UsersList.create',
    },
    DEVICELIST: {
        CREATE: 'DeviceList.create',
        UPDATE: 'DeviceList.update',
        DISABLE: 'DeviceList.disable',
        DELETE: 'DeviceList.delete',
    },
    DEVICECONNECT: {
        CREATE: 'DeviceConnect.create',
    },
    ASSETLIST: {
        CREATE: 'AssetList.create',
        DISABLE: 'AssetList.disable',
        UPDATE: 'AssetList.update',
        DELETE: 'AssetList.delete',
    },
    ASSETMEMBER: {
        CREATE: 'AssetMember.create',
        ADMIN: 'AssetMember.admin',
        EDITOR: 'AssetMember.editor',
    },
    ASSETGROUP: {
        CREATE: 'AssetGroup.create',
    },
    ASSETCONNECT: {
        CREATE: 'AssetConnect.create',
    },
    ASSETGROUPLIST: {
        CREATE: 'AssetGroupList.create',
        DISABLE: 'AssetGroupList.disable',
        UPDATE: 'AssetGroupList.update',
        DELETE: 'AssetGroupList.delete',
    },
    ASSETGROUPMEMBER: {
        CREATE: 'AssetGroupMember.create',
        ADMIN: 'AssetGroupMember.admin',
        EDITOR: 'AssetGroupMember.editor',
    }
}

const PERMISSIONS: any = {
    administrator: [
        MODULE.USERSLIST.CREATE,
        MODULE.USERSLIST.VIEW,
        MODULE.MEMBERLIST.CREATE,
        MODULE.DEVICELIST.CREATE,
        MODULE.DEVICELIST.UPDATE,
        MODULE.DEVICELIST.DISABLE,
        MODULE.DEVICELIST.DELETE,
        MODULE.DEVICECONNECT.CREATE,
        MODULE.ASSETLIST.CREATE,
        MODULE.ASSETLIST.DISABLE,
        MODULE.ASSETLIST.UPDATE,
        MODULE.ASSETLIST.DELETE,
        MODULE.ASSETMEMBER.CREATE,
        MODULE.ASSETMEMBER.ADMIN,
        MODULE.ASSETGROUP.CREATE,
        MODULE.ASSETCONNECT.CREATE,
        MODULE.ASSETGROUPLIST.CREATE,
        MODULE.ASSETGROUPLIST.DISABLE,
        MODULE.ASSETGROUPLIST.UPDATE,
        MODULE.ASSETGROUPLIST.DELETE,
        MODULE.ASSETGROUPMEMBER.CREATE,
        MODULE.ASSETGROUPMEMBER.ADMIN,
        MODULE.ORGANIZATIONINFO.DISABLE,
        MODULE.ORGANIZATIONINFO.UPDATE,
        MODULE.ORGANIZATIONINVITATION.MENU,
    ],
    superAdmin: [
        MODULE.USERSLIST.CREATE,
        MODULE.USERSLIST.VIEW,
        MODULE.MEMBERLIST.CREATE,
        MODULE.DEVICELIST.CREATE,
        MODULE.DEVICELIST.UPDATE,
        MODULE.DEVICELIST.DISABLE,
        MODULE.DEVICELIST.DELETE,
        MODULE.DEVICECONNECT.CREATE,
        MODULE.ASSETLIST.CREATE,
        MODULE.ASSETLIST.DISABLE,
        MODULE.ASSETLIST.UPDATE,
        MODULE.ASSETLIST.DELETE,
        MODULE.ASSETMEMBER.CREATE,
        MODULE.ASSETMEMBER.ADMIN,
        MODULE.ASSETGROUP.CREATE,
        MODULE.ASSETCONNECT.CREATE,
        MODULE.ASSETGROUPLIST.CREATE,
        MODULE.ASSETGROUPLIST.DISABLE,
        MODULE.ASSETGROUPLIST.UPDATE,
        MODULE.ASSETGROUPLIST.DELETE,
        MODULE.ASSETGROUPMEMBER.CREATE,
        MODULE.ASSETGROUPMEMBER.ADMIN,
        MODULE.ORGANIZATIONINFO.DISABLE,
        MODULE.ORGANIZATIONINFO.UPDATE,
        MODULE.ORGANIZATIONINVITATION.MENU
    ],
    editor: [
        // MODULE.USERSLIST.CREATE,
        MODULE.DEVICECONNECT.CREATE,
        MODULE.ASSETLIST.UPDATE,
        MODULE.ASSETMEMBER.CREATE,
        MODULE.ASSETMEMBER.EDITOR,
        MODULE.DEVICELIST.UPDATE,
        MODULE.ASSETGROUP.CREATE,
        MODULE.ASSETCONNECT.CREATE,
        MODULE.ASSETGROUPLIST.UPDATE,
        MODULE.ASSETGROUPMEMBER.CREATE,
        MODULE.ASSETGROUPMEMBER.EDITOR,
        MODULE.ORGANIZATIONINFO.UPDATE,
    ],
    viewer: [
        // MODULE.USERSLIST.CREATE,
    ],
    member: [
        // MODULE.USERSLIST.CREATE,
    ]
}

const getRole = (): any | undefined => {
    if (!localStorage) {
        return
    }

    const lsValue: string | null = localStorage.getItem(ROLE_LOCAL_STORAGE_KEY)
    if (!lsValue) {
        return
    }

    try {
        const role: any = JSON.parse(lsValue)
        if (role) {
            // You can easily check auth_token expiration also
            return role
        }
    } catch (error) {
        console.error('ROLE LOCAL STORAGE PARSE ERROR', error)
    }
}

const setRole = (role: any) => {
    if (!localStorage) {
        return
    }

    try {
        const lsValue = JSON.stringify(role)
        localStorage.setItem(ROLE_LOCAL_STORAGE_KEY, lsValue)
    } catch (error) {
        console.error('ROLE LOCAL STORAGE SAVE ERROR', error)
    }
}

const removeRole = () => {
    if (!localStorage) {
        return
    }

    try {
        localStorage.removeItem(ROLE_LOCAL_STORAGE_KEY)
    } catch (error) {
        console.error('ROLE LOCAL STORAGE REMOVE ERROR', error)
    }
}

const getRolePermission = async (moduleName: string, id: string = '') => {
    let role = getRole()

    if (!role) {
        return null;
    }

    if (role === 'member' && id) {
        let rolePermissions = [];
        if (moduleName === MODULENAME.DEVICELIST || moduleName === MODULENAME.DEVICECONNECT) {
            rolePermissions = await getThingPermissions(id);
        } else if (moduleName === MODULENAME.ASSETLIST || moduleName === MODULENAME.ASSETMEMBER) {
            rolePermissions = await getChannelPermissions(id);
        } else if (moduleName === MODULENAME.ASSETGROUPLIST || moduleName === MODULENAME.ASSETGROUPMEMBER || moduleName === MODULENAME.ASSETCONNECT || moduleName === MODULENAME.ASSETGROUP) {
            rolePermissions = await getGroupPermissions(id);
        }
        if (rolePermissions.permissions.includes('admin')) {
            role = 'administrator';
        } else if (rolePermissions.permissions.includes('edit')) {
            role = 'editor';
        } else if (rolePermissions.permissions.includes('view')) {
            role = 'viewer';
        } else {
            role = 'member';
        }
    }

    const allowedActions = (PERMISSIONS[role] || []).filter((permission: string) =>
        permission.startsWith(moduleName)
    );

    if (allowedActions.length > 0) {
        return allowedActions.reduce((actions: any, action: any) => {
            const actionType = action.split('.')[1];
            actions[actionType] = true;
            return actions;
        }, {} as Record<string, boolean>);
    }

    return null;
}

export { getRole, setRole, removeRole, getRolePermission, ROLE_LOCAL_STORAGE_KEY, MODULENAME }