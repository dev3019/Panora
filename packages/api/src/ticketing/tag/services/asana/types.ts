export type AsanaTagInput = {
  /** The workspace to filter tags on. */
  workspace?: string;
  /** Results per page.
   * The number of objects to return per page.
   * The value must be between 1 and 100.
   */
  limit?: number;
}

export type AsanaTagOutput = {
  /** Globally unique identifier of the resource, as a string. */
  gid: string;
  /** The base type of this resource. */
  resource_type: string;
  /** Name of the tag.
   * This is generally a short sentence fragment that fits on a line in the UI for maximum readability. However, it can be longer. 
  */
  name: string;
}