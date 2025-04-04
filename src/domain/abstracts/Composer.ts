import DefaultRouter from "../../utils/helpers/default-router";

export default abstract class Composer {
  static compose(): DefaultRouter {
    throw new Error("Must be implemented");
  }
}
