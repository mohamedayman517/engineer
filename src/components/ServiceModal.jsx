import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ServiceModal({ show, handleClose, handleSave, service }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        title: '',
        description: '',
        icon: '',
        color: '#3498db',
        isActive: true,
        order: 0
      });
    }
  }, [service, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSave = () => {
    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{service ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>العنوان</Form.Label>
            <Form.Control type="text" name="title" value={formData.title || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>الوصف</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>الأيقونة</Form.Label>
            <Form.Control 
              type="text" 
              name="icon" 
              value={formData.icon || ''} 
              onChange={handleChange}
              placeholder="أدخل رمز تعبيري (مثل: 🏠) أو أيقونة FontAwesome (مثل: fa-home)"
            />
            <Form.Text className="text-muted">
              يمكنك استخدام الرموز التعبيرية مباشرة (مثل 🏠) أو رموز FontAwesome (مثل fa-home)
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>اللون</Form.Label>
            <Form.Control type="color" name="color" value={formData.color || ''} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>الترتيب</Form.Label>
            <Form.Control type="number" name="order" value={formData.order || 0} onChange={handleChange} />
          </Form.Group>
          <Form.Check 
            type="switch"
            id="custom-switch"
            label="نشط"
            name="isActive"
            checked={formData.isActive || false}
            onChange={handleChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          إغلاق
        </Button>
        <Button variant="primary" onClick={onSave}>
          حفظ التغييرات
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ServiceModal;
