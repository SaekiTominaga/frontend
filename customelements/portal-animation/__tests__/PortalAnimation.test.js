import { describe, test, expect } from '@jest/globals';
import PortalAnimation from '../dist/PortalAnimation.js';

describe('x-portal-animation', () => {
	customElements.define('x-portal-animation', PortalAnimation);

	test('connected & disconnected', () => {
		const element = document.createElement('x-portal-animation');
		element.setAttribute('src', 'foo');
		element.setAttribute('referrerpolicy', 'bar');
		document.body.appendChild(element);
		element.remove();
	});

	test('src attribute', () => {
		const portalAnimation = new PortalAnimation();

		expect(portalAnimation.src).toBeNull();
		portalAnimation.src = 'foo';
		expect(portalAnimation.src).toBe('foo');
		portalAnimation.src = null;
		expect(portalAnimation.src).toBeNull();
	});

	test('referrerpolicy attribute', () => {
		const portalAnimation = new PortalAnimation();

		expect(portalAnimation.referrerpolicy).toBeNull();
		portalAnimation.referrerpolicy = 'foo';
		expect(portalAnimation.referrerpolicy).toBe('foo');
		portalAnimation.referrerpolicy = null;
		expect(portalAnimation.referrerpolicy).toBeNull();
	});
});
