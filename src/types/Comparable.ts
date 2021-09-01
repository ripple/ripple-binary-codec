import SerializedType from './SerializedType'

/**
 * Base class for SerializedTypes that are comparable.
 */
export default abstract class Comparable extends SerializedType {
  public lt(other: Comparable): boolean {
    return this.compareTo(other) < 0
  }

  public eq(other: Comparable): boolean {
    return this.compareTo(other) === 0
  }

  public gt(other: Comparable): boolean {
    return this.compareTo(other) > 0
  }

  public gte(other: Comparable): boolean {
    return this.compareTo(other) > -1
  }

  public lte(other: Comparable): boolean {
    return this.compareTo(other) < 1
  }

  /**
   * Overload this method to define how two Comparable SerializedTypes are compared.
   *
   * @param other - The comparable object to compare this to.
   * @returns 1, 0, or 1 depending on how the objects relate to each other.
   */
  public abstract compareTo(other: Comparable): number
}
