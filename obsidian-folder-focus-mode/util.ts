const normalizeArray = (parts: string[], allowAboveRoot: boolean) => {
	const res = [];
	for (let i = 0; i < parts.length; i++) {
		const p = parts[i];

		// ignore empty parts
	if (!p || p === '.')
		continue;

	if (p === '..') {
			if (res.length && res[res.length - 1] !== '..') {
				res.pop();
			} else if (allowAboveRoot) {
				res.push('..');
			}
		} else {
			res.push(p);
		}
	}

	return res;
}

const trimArray = (arr: any[]) => {
	const lastIndex = arr.length - 1;
	let start = 0;
	for (; start <= lastIndex; start++) {
		if (arr[start])
			break;
	}

	let end = lastIndex;
	for (; end >= 0; end--) {
		if (arr[end])
			break;
	}

	if (start === 0 && end === lastIndex)
		return arr;
	if (start > end)
		return [];
	return arr.slice(start, end + 1);
}

const resolve = (path: string) => {
	let resolvedPath = '',
	resolvedAbsolute: boolean;

	resolvedPath = path + '/' + resolvedPath;
	resolvedAbsolute = path[0] === '/';

	// Normalize the path
	resolvedPath = normalizeArray(resolvedPath.split('/'),
									!resolvedAbsolute).join('/');

	return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

const getRelativePath = (from: string, to: string): string => {
	from = resolve(from).substr(1);
	to = resolve(to).substr(1);

	const fromParts = trimArray(from.split('/'));
	const toParts = trimArray(to.split('/'));

	const length = Math.min(fromParts.length, toParts.length);
	let samePartsLength = length;
	for (let i = 0; i < length; i++) {
		if (fromParts[i] !== toParts[i]) {
			samePartsLength = i;
			break;
		}
	}

	let outputParts = [];
	for (let i = samePartsLength; i < fromParts.length; i++) {
		outputParts.push('..');
	}

	outputParts = outputParts.concat(toParts.slice(samePartsLength));

	return outputParts.join('/');
}

const isAbsolutePath = (path: string): boolean => {
	return path.charAt(0) === '/';
}

const getDirname = (path: string): string => {
	return path.substring(0, path.lastIndexOf("/"));
}

const getRootDirname = (path: string): string => {
	return path.substring(0, path.indexOf("/"));
}

export {
	getRelativePath,
	isAbsolutePath,
	getDirname,
	getRootDirname
}
