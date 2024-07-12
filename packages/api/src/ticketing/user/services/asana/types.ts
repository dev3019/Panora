/**
 * Returns the user records for all users in all workspaces and organizations accessible to the authenticated user. Accepts an optional workspace ID parameter.
 * Results are sorted by user ID.
 */
export type AsanaUserInput = {
  /**
   * The workspace or organization ID to filter users on.
   */
  workspace?: string;
  /**
   * The team ID to filter users on.
   */
  team?: string;
}

export type AsanaUserOutput = Users;

interface Users{
  gid: string;
  name: string;
  resource_type: string;
}