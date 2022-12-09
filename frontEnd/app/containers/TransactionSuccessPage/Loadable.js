import React from 'react';
import loadable from 'utils/loadable';

import LoadingElement from 'containers/LoadingElement/Loadable';

export default loadable(() => import('./index'), {
  fallback: <LoadingElement />,
});
