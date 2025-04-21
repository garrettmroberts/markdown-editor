import React, { FC } from 'react';

interface BreadCrumbsProps {
  crumbs: string[];
  onClick?: (crumb: string) => void;
}

const BreadCrumbs: FC<BreadCrumbsProps> = ({ crumbs, onClick }) => {
  if (crumbs.length === 0) {
    return <div data-testid="bread-crumbs" className="bread-crumbs" />;
  }

  return (
    <div data-testid="bread-crumbs" className="bread-crumbs">
      <p>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return isLast ? (
            <span
              key={`${crumb}-${index}`}
              onClick={() => onClick && onClick(crumb)}
              className={`bread-crumbs__crumb ${onClick ? 'bread-crumbs__crumb--link' : ''}`}
            >
              {crumb}
            </span>
          ) : (
            <React.Fragment key={`${crumb}-${index}`}>
              <span
                onClick={() => onClick && onClick(crumb)}
                className={`bread-crumbs__crumb ${onClick ? 'bread-crumbs__crumb--link' : ''}`}
              >
                {crumb}
              </span>
              {' > '}
            </React.Fragment>
          );
        })}
      </p>
    </div>
  );
};

export default BreadCrumbs;
