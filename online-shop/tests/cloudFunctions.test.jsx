import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import businessCalculations from '../utils/businessCalculations.jsx';

const businesscalculations = new businessCalculations();

describe('getCartCount', () => {
    test('getCartCount', () => {
        
        const {getCartCount} = require('../functions/index.js')
        const getCartCountBusinessCalculations = businesscalculations.getCartCount

    
        const count = getCartCountBusinessCalculations(['PPB#1'])
        const count2 = getCartCount(['PPB#1'])
        expect(count).toEqual({'PPB#1': 1})
        expect(count2).toEqual(count)
        
    })

    test('getValueAddedTax', () => {
            
            const {getValueAddedTax} = require('../functions/index.js')
            const getValueAddedTaxBusinessCalculations = businesscalculations.getValueAddedTax
            const vat = getValueAddedTaxBusinessCalculations(1000)
            const vat2 = getValueAddedTax(1000)
            expect(vat).toEqual(107.14)
            expect(vat2).toEqual(vat)
            
    })

})