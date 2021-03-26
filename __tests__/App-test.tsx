import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';

let mockAsyncStorage: { [key: string]: string } = {
  'test': '10'
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem:  jest.fn((key: string, value: string) => {
		return new Promise((resolve) => {
      mockAsyncStorage[key] = value;
			resolve(null);
		});
	}),
  getItem: jest.fn((key) => {
		return new Promise((resolve) => {
			if (mockAsyncStorage[key]) {
				resolve(mockAsyncStorage[key]);
			} else {
				resolve(null);
			}
		});
	})
}));

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

it('renders correctly', () => {
  jest.useFakeTimers();
  renderer.create(<App />);
});

it('AsyncStorage get test', async () => {
  const result = await AsyncStorage.getItem('test');
  expect(result).toBe('10');
  expect(AsyncStorage.getItem).toBeCalledWith('test');
});

it('AsyncStorage set and get test', async () => {
  await AsyncStorage.setItem('test2', '20');
  const result = Number(await AsyncStorage.getItem('test2'));
  expect(result).toBe(20);
});

it('AsyncStorage get not exist key', async () => {
  const result = await AsyncStorage.getItem('test3');
  expect(result).toBe(null);
  expect(AsyncStorage.getItem).toBeCalledWith('test3');
});
