import { GuildMember, APIInteractionGuildMember } from "discord.js";
export const hasRole = (member: GuildMember, role: string) =>
  member.roles.cache.has(role);
