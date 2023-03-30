import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppContext } from '../src/AppContext';
import NavBar from '../src/components/NavBar';
import {auth} from './authWrapper'

describe('Integration Test', () => {
  test('NavBar renders correctly', () => {
    const user = auth.currentUser;
  });
});