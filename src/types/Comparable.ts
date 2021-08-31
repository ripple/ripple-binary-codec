import SerializedType from './SerializedType'

/**
 * Base class for SerializedTypes that are comparable.
 */
export default class Comparable extends SerializedType {
  lt(other: Comparable): boolean {
    return this.compareTo(other) < 0
  }

  eq(other: Comparable): boolean {
    return this.compareTo(other) === 0
  }

  gt(other: Comparable): boolean {
    return this.compareTo(other) > 0
  }

  gte(other: Comparable): boolean {
    return this.compareTo(other) > -1
  }

  lte(other: Comparable): boolean {
    return this.compareTo(other) < 1
  }

  /**
   * Overload this method to define how two Comparable SerializedTypes are compared.
   *
   * @param other - The comparable object to compare this to.
   * @returns A number denoting the relationship of this and other.
   * @throws {Error}
   */
  compareTo(other: Comparable): number {
    throw new Error(`cannot compare ${this.toString()} and ${other.toString()}`)
  }
}
