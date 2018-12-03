'use strict';
 
module.exports = {
 
  types: [
    {
      value: 'wip',
      name : 'wip:      功能开发中'
    },
    {
      value: 'feat',
      name : 'feat:     功能开发完成'
    },
    {
      value: 'fix',
      name : 'fix:      修复补丁'
    },
    {
      value: 'refactor',
      name : 'refactor: 重构代码'
    },
    {
      value: 'docs',
      name : 'docs:     添加文档说明或注释'
    },
    {
      value: 'test',
      name : 'test:     添加测试用例'
    },
    {
      value: 'chore',
      name : 'chore:    更新非功能代码文件，比如更新构建脚本'
    },
    {
      value: 'style',
      name : 'style:    格式化代码，不影响功能的调整'
    },
    {
      value: 'revert',
      name : 'revert:   回滚类型的提交'
    }
  ],
 
  scopes: [],
 
  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"]
};