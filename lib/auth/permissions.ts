import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from 'better-auth/plugins/organization/access';

const statement = {
    project: ["create", "share", "update", "delete"] as const,
    organization: defaultStatements.organization ,
    member: defaultStatements.member ,
    invitation: defaultStatements.invitation ,
    team: defaultStatements.team ,
    ac: defaultStatements.ac ,
} as const;

const ac = createAccessControl(statement);

const admin = ac.newRole({ 
    project: ["create", "update"] as const, 
}); 

const owner = ac.newRole({ 
    project: ["create", "update", "delete"] as const, 
    organization: ["update", "delete"] as const,
    member: ["create", "update", "delete"] as const,
    invitation: ["create", "cancel"] as const,
    team: ["create", "update", "delete"] as const,
    ac: ["create", "read", "update", "delete"] as const,
}); 

const memberRole = ac.newRole({ 
    project: ["create"] as const, 
}); 

export { ac, statement, admin, owner, memberRole as Member };