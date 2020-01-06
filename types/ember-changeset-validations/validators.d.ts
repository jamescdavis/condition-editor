import { ValidatorMapFunc } from 'ember-changeset/types';

export function validatePresence(options: {} | boolean): ValidatorMapFunc;
export function validateLength(options: {}): ValidatorMapFunc;
export function validateNumber(options: {}): ValidatorMapFunc;
export function validateInclusion(options: {}): ValidatorMapFunc;
export function validateExclusion(options: {}): ValidatorMapFunc;
export function validateFormat(options: {}): ValidatorMapFunc;
export function validateConfirmation(options: {}): ValidatorMapFunc;
