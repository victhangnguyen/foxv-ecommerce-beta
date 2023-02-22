import { Link } from 'react-router-dom';
function BreadcrumbComponent({ breadcrumbRoute }) {
  const renderBreadcrumbItem = breadcrumbRoute.map((bc, index) => (
    <li
      key={index}
      className={`breadcrumb-item ${bc.active ? 'active' : ''}`}
    >
      <Link to={bc.path}>{bc.label}</Link>
    </li>
  ));
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">{renderBreadcrumbItem}</ol>
    </nav>
  );
}

export default BreadcrumbComponent;
