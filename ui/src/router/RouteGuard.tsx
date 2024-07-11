/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/*
 * 守卫函数作用说明：
 *
 * | 守卫函数              | 作用说明                                                                                   |
 * |-----------------------|--------------------------------------------------------------------------------------------|
 * | deriveLoginState      | 推导用户的登录状态和权限，包括是否登录、是否激活、是否被禁止、是否为管理员或版主。          |
 * | logged                | 检查用户是否已登录，未登录则重定向到登录页面。                                              |
 * | loggedRedirectHome    | 检查用户是否已登录，未登录则重定向到主页。                                                  |
 * | notLogged             | 检查用户是否未登录，已登录则重定向到主页。                                                  |
 * | notActivated          | 检查用户是否未激活，已激活则重定向到主页。                                                  |
 * | activated             | 检查用户是否已登录并且已激活，未激活则重定向到未激活页面。                                   |
 * | forbidden             | 检查用户是否被禁止，未被禁止则重定向到主页。                                                |
 * | notForbidden          | 检查用户是否未被禁止，被禁止则重定向到被禁页面。                                            |
 * | admin                 | 检查用户是否为管理员，非管理员则返回错误信息。                                              |
 * | isAdminOrModerator    | 检查用户是否为管理员或版主，非管理员和版主则返回错误信息。                                  |
 * | isEditable            | 检查页面内容是否可编辑，根据加载的数据决定。                                                |
 * | allowNewRegistration  | 检查是否允许新用户注册，不允许则重定向到主页。                                              |
 * | singUpAgent           | 检查注册代理 URL，如果不同则重定向到注册代理 URL。                                          |
 * | shouldLoginRequired   | 检查页面是否需要登录访问，根据登录设置和忽略路径决定是否重定向到登录页面。                  |
 * | tryNormalLogged       | 检查用户是否正常登录，未登录或有问题则根据情况重定向到相应页面。                            |
 * | tryLoggedAndActivated | 检查用户是否已登录并激活，未登录或未激活则返回错误。                                        |
 * | handleLoginRedirect   | 处理登录成功后的页面重定向逻辑，重定向到存储的路径或主页。                                  |
 * | handleLoginWithToken  | 使用 token 处理登录逻辑，更新用户状态并重定向到相应页面。                                    |
 * | initAppSettingsStore  | 初始化应用设置状态，更新站点信息、界面设置、登录设置等。                                    |
 * | googleSnapshotRedirect| 处理从 Google 快照页面的重定向逻辑。                                                       |
 * | setupApp              | 初始化应用程序，预初始化用户信息和应用设置，并设置应用的语言、时区和主题。                  |
 */
import { FC, ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';

import { floppyNavigation } from '@/utils';
import { TGuardFunc, TGuardResult } from '@/utils/guard';

import RouteErrorBoundary from './RouteErrorBoundary';

const RouteGuard: FC<{
  children: ReactNode;
  onEnter: TGuardFunc;
  path?: string;
  page?: string;
}> = ({ children, onEnter, path, page }) => {
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const [gk, setKeeper] = useState<TGuardResult>({
    ok: true,
  });
  const [gkError, setGkError] = useState<TGuardResult['error']>();
  const applyGuard = () => {
    if (typeof onEnter !== 'function') {
      return;
    }

    const gr = onEnter({
      loaderData,
      path,
      page,
    });

    setKeeper(gr);
    if (
      gr.ok === false &&
      gr.error?.code &&
      /403|404|50X/i.test(gr.error.code.toString())
    ) {
      setGkError(gr.error);
      return;
    }
    setGkError(undefined);
    if (gr.redirect) {
      floppyNavigation.navigate(gr.redirect, {
        handler: navigate,
        options: { replace: true },
      });
    }
  };
  useEffect(() => {
    /**
     * By detecting changes to location.href, many unnecessary tests can be avoided
     */
    applyGuard();
  }, [window.location.href]);

  let asOK = gk.ok;
  if (gk.ok === false && gk.redirect) {
    /**
     * It is possible that the route guard verification fails
     *    but the current page is already the target page for the route guard jump
     * This should render `children`!
     */
    asOK = floppyNavigation.equalToCurrentHref(gk.redirect);
  }
  return (
    <>
      {asOK ? children : null}
      {gkError ? <RouteErrorBoundary errCode={gkError.code as string} /> : null}
    </>
  );
};

export default RouteGuard;
