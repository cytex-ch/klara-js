export class OrganisationNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrganisationNotFoundException';
  }
}
