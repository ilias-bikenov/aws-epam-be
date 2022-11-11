export default abstract class AbstractDbClient {
  constructor(config) {}

  public execute(query: string, args: Array<any>) {}
}
