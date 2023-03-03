import { Link } from 'react-router-dom';
function BreadcrumbComponent({ breadcrumbItems }) {
  const renderBreadcrumbItem = breadcrumbItems.map((item) => (
    <li
      key={item.key}
      className={`breadcrumb-item ${item.active ? 'active' : ''}`}
    >
      <Link to={item.path}>{item.label}</Link>
    </li>
  ));
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">{renderBreadcrumbItem}</ol>
    </nav>
  );
}

export default BreadcrumbComponent;
