import {describe, test,expect} from 'vitest';
import {return1} from '../src/components/AccountMenu'

describe("Account Menu", () => {
    test("return 1", () => {
        expect(return1()).toBe(1)
    })
})