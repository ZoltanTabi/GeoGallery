import 'react-native';
import { getDistance } from '../helpers/drawing';

describe('distance between 2 points', () => {
    it('distance between same points is 0', () => {
        expect(getDistance(10, 10, 10, 10)).toBe(0);
    });
    it('distance between (10, 10) and (20, 20) is 1544757.56', () => {
        expect(getDistance(10, 10, 20, 20).toFixed(2)).toBe("1544757.56");
    });
    it('distance from A to B equals from B to A', () => {
        expect(getDistance(10, 10, 20, 20)).toBe(getDistance(20, 20, 10, 10));
    });
});
