import assert from 'assert';
import { IApi } from '../../types';

export default (api: IApi) => {
  api.onCheck(async () => {
    // routes
    assert(
      api.appData.routes,
      `routes not found, you may be run umi on the wrong directory.`,
    );

    await api.applyPlugins({
      key: 'onChangePkgJSON',
      args: {
        current: api.appData.pkg,
      },
    });
    await api.applyPlugins({
      key: 'onCheckConfig',
      args: {
        config: api.config,
        userConfig: api.userConfig,
      },
    });
  });

  api.onCheckCode((args) => {
    // Fixed version import is not allowed
    // e.g. import { X } from '_@ant-design_icons@4.7.0@ant-design/icons'
    if (['cnpm', 'tnpm'].includes(api.appData.npmClient)) {
      args.imports.forEach(({ source }) => {
        if (/@\d/.test(source)) {
          throw new Error(`${source} is not allowed to import.`);
        }
      });
    }
  });
};
