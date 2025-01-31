const { readFile } = require('fs').promises;
const { relative, resolve } = require('path');
const { create } = require('./lib/cli');
const { expand } = require('./lib/utils');
const snapshots = require('./images/create');

describe('preact create', () => {
	it(`scaffolds the 'default' official template`, async () => {
		let dir = await create('default');

		let output = await expand(dir).then(arr => {
			return arr.map(x => relative(dir, x));
		});

		expect(output.sort()).toEqual(snapshots.default);
	});

	it(`should use template.html from the github repo`, async () => {
		let dir = await create('netlify');

		const templateFilePath = resolve(__dirname, dir, 'src', 'template.html');
		const template = await readFile(templateFilePath, 'utf8');

		expect(template.includes('twitter:card')).toEqual(true);
	});

	it(`should have 'apple-touch-icon' meta tag`, async () => {
		let dir = await create('simple');

		const templateFilePath = resolve(__dirname, dir, 'src', 'template.html');
		const template = await readFile(templateFilePath, 'utf8');

		expect(template.includes('apple-touch-icon')).toEqual(true);
	});

	it('should fail given an invalid name', async () => {
		// @ts-ignore
		const exit = jest.spyOn(process, 'exit').mockImplementation(() => {});
		await create('simple', '*()@!#!$-Invalid-Name');

		expect(exit).toHaveBeenCalledWith(1);
	});
});
