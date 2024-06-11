import { errorConstraintType } from 'libs/common/src/exceptions';

export const IS_NOT_A_STRING: errorConstraintType = {
	key: 'valueIsNotAString',
	message: 'property must be a valid string',
};

export const IS_NOT_AN_ARRAY: errorConstraintType = {
	key: 'valueIsNotAnArray',
	message: 'property must be a valid array',
};

export const IS_NOT_INT: errorConstraintType = {
	key: 'valueIsNotAnInt',
	message: 'value is not int',
};

export const GREATER_THAN_MAX_VALUE: errorConstraintType = {
	key: 'greaterThanMaxValue',
	message: 'must be less than maximum value',
};
export const LESS_THAN_MIN_VALUE: errorConstraintType = {
	key: 'lessThanMinValue',
	message: 'must be greater than minimum value',
};
