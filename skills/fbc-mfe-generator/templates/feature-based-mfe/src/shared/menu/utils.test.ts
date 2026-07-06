import { buildPathAncestors, isAncestorActive } from './utils';
import { MenuItemData } from './model/types';

describe('buildPathAncestors', () => {
  it('builds ancestor map for simple parent-child menu', () => {
    const menu: MenuItemData[] = [
      {
        id: 'parent',
        path: '/parent',
        label: 'parent',
        children: [{ 
            id: 'child', 
            path: '/parent/child',
            label: 'child'
        }],
      },
    ];

    const result = buildPathAncestors(menu);

    expect(result['/parent']).toEqual([]); // parent has no ancestors
    expect(result['/parent/child']).toEqual(['parent']);
  });

  it('handles deeper nesting', () => {
    const menu: MenuItemData[] = [
      {
        id: 'root',
        path: '/root',
        label: 'root',
        children: [
          {
            id: 'level1',
            path: '/root/level1',
            label: 'level1',
            children: [
              { id: 'level2', path: '/root/level1/level2', label: 'level2' },
            ],
          },
        ],
      },
    ];

    const result = buildPathAncestors(menu);

    expect(result['/root']).toEqual([]);
    expect(result['/root/level1']).toEqual(['root']);
    expect(result['/root/level1/level2']).toEqual(['root', 'level1']);
  });

  it('ignores items without a path', () => {
    const menu: MenuItemData[] = [
      { id: 'noPath', label: 'noPath', children: [{ id: 'child', path: '/child', label: 'child' }] },
    ];

    const result = buildPathAncestors(menu);

    expect(result['/child']).toEqual(['noPath']);
    expect(result).not.toHaveProperty('noPath');
  });

  it('returns empty map for empty menu', () => {
    expect(buildPathAncestors([])).toEqual({});
  });
});

describe('isAncestorActive', () => {
  const menu: MenuItemData[] = [
    {
      id: 'parent',
      path: '/parent',
      label: 'parent',
      children: [{ id: 'child', path: '/parent/child', label: 'child' }],
    },
  ];
  const ancestorsMap = buildPathAncestors(menu);

  it('returns true when item is ancestor of current path', () => {
    const parentItem = menu[0];
    expect(isAncestorActive(parentItem, '/parent/child', ancestorsMap)).toBe(true);
  });

  it('returns false when item is not ancestor of current path', () => {
    const childItem = menu[0].children![0];
    expect(isAncestorActive(childItem, '/parent/child', ancestorsMap)).toBe(false);
  });

  it('returns false when current path not in map', () => {
    const parentItem = menu[0];
    expect(isAncestorActive(parentItem, '/unknown', ancestorsMap)).toBe(false);
  });
});
