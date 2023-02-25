import { Link } from 'react-router-dom';
function BreadcrumbComponent({ breadcrumbItems }) {
  const renderBreadcrumbItem = breadcrumbItems.map((item, index) => (
    <li
      key={index}
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
