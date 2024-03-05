/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Import portions of React that are needed.
import React, { useRef } from 'react';

// Other standard imports.
import PropTypes from 'prop-types';
import cx from 'classnames';

import { pkg } from '../../settings';

// Carbon and package components we use.
import { Launch } from '@carbon/icons-react';
import uuidv4 from '../../global/js/utils/uuidv4';
import NavItemLink from './NavItemLink';

// The block part of our conventional BEM class names (blockClass__E--M).
export const blockClass = `${pkg.prefix}--nav-item`;
const componentName = 'NavItem';

// Default values for props
const defaults = {
  activeHref: '#',
  disabled: false,
  onClick: () => {},
  tabIndex: 0,
};

/**
 * Navigation item component.
 */
export const NavItem = ({
  activeHref = defaults.activeHref,
  children = defaults.children,
  className,
  current,
  disabled = defaults.disabled,
  handleItemSelect,
  href,
  id,
  label,
  onClick = defaults.onClick,
  tabIndex = defaults.tabIndex,
  // Collect any other property values passed in.
  ...rest
}) => {
  const internalId = useRef(uuidv4());
  const instanceId = `${blockClass}__${internalId.current}`;
  const navItemId = id || instanceId;

  const isAbsoluteLink = new RegExp('^([a-z]+://|//)', 'i');
  const externalLink =
    isAbsoluteLink.test(href) && href.indexOf(window.location.host) === -1;
  const linkClassName = `${blockClass}__link`;

  const handleDisabled = (action, defaultValue = null) => {
    console.log(`clicked item`);
    return !disabled ? action : defaultValue;
  };

  const navItemTabIndex = handleDisabled(tabIndex, -1);

  const externalLinkProps = externalLink && {
    rel: 'noopener noreferrer',
    target: '_blank',
  };

  return (
    <li
      {...rest}
      className={cx(blockClass, className, {
        [`${blockClass}--active`]:
          (current !== null && current === navItemId) ||
          (activeHref !== undefined && activeHref === href && !externalLink),
        [`${blockClass}--disabled`]: disabled,
      })}
      label={label}
      onClick={(event) => handleDisabled(onClick(event, href))}
      onKeyDown={(event) => handleDisabled(onClick(event, href))}
      role="menuitem"
    >
      <a
        id={navItemId}
        className={cx(linkClassName, {
          [`${blockClass}__link--external`]: externalLink,
        })}
        href={href}
        tabIndex={navItemTabIndex}
        {...rest}
        {...externalLinkProps}
      >
        {children}
        {externalLink && (
          <Launch className={`${blockClass}__link--external__icon`} />
        )}
      </a>
    </li>
  );
};

// The display name of the component, used by React. Note that displayName
// is used in preference to relying on function.name.
NavItem.displayName = componentName;

// The types and DocGen commentary for the component props,
// in alphabetical order (for consistency).
// See https://www.npmjs.com/package/prop-types#usage.
NavItem.propTypes = {
  /**
   * Hypertext reference for active page.
   */
  activeHref: PropTypes.string,
  /**
   * Provide the contents of the Nav.
   */
  children: PropTypes.node.isRequired,
  /**
   * Provide an optional class to be applied to the containing node.
   */
  className: PropTypes.string,
  /**
   * Currently selected item.
   */
  current: PropTypes.string,
  /**
   * Whether the item is disabled.
   */
  disabled: PropTypes.bool,

  /**
   * Click handler of an item.
   */
  handleItemSelect: PropTypes.func,

  /**
   * The href of the nav item.
   */
  href: PropTypes.string,

  /**
   * Identifier.
   */
  id: PropTypes.string,

  /**
   * Label of an item.
   */
  label: PropTypes.string,

  /**
   * Click handler of an item.
   */
  onClick: PropTypes.func,

  /**
   * `tabindex` of an item.
   */
  tabIndex: PropTypes.number,
};

export default NavItem;
