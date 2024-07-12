export type AsanaTeamOutput = {
  /** Globally unique identifier of the resource, as a string. */
  gid: string;
  /** The name of the team. */
  name: string;
  organization: Organization;
  /** A url that points directly to the object within Asana. */
  permalink_url: string;
  resource_type: string;
};

export type AsanaTeamInput = {
  /** Globally unique identifier for the team. */
  team_gid: string;
};

/** The organization/workspace the team belongs to. */
interface Organization {
  gid: string;
  name: string;
  resource_type: string;
}