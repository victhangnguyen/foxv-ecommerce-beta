import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import * as yup from 'yup';

//! imp Components
import { Button } from 'react-bootstrap';
import FormComponent from '../../../components/Form/FormComponent';
import InputComponent from '../../../components/Form/InputComponent';
import SelectControllerComponent from '../../../components/Form/SelectControllerComponent';

//! imp Constants
import constants from '../../../constants';

const OrderFormComponent = ({
  orderId,
  initialValues,
  loading,
  onSubmit,
  handleClickCancel,
}) => {
  const phoneNumerRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  const unicodeLetters = /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF ]+$/;

  const statusOptions = [
    {
      key: 0,
      value: constants.order.status.PENDING,
      label: constants.order.status.PENDING,
    },
    {
      key: 1,
      value: constants.order.status.PAID,
      label: constants.order.status.PAID,
    },
    {
      key: 2,
      value: constants.order.status.SHIPPED,
      label: constants.order.status.SHIPPED,
    },
    {
      key: 3,
      value: constants.order.status.DELIVERED,
      label: constants.order.status.DELIVERED,
    },
    {
      key: 4,
      value: constants.order.status.COMPLETED,
      label: constants.order.status.COMPLETED,
    },
    {
      key: 5,
      value: constants.order.status.CANCELED,
      label: constants.order.status.CANCELED,
    },
  ];

  const auth = useSelector((state) => state.auth);
  const isAdminController = auth.user?.roles
    ?.map((role) => role.name)
    .includes('admin');

  const validationSchema = yup.object({
    name: yup
      .string()
      .min(4, 'Ít nhất 4 ký tự.')
      .max(64, 'Nhiều nhất 64 ký tự.')
      .matches(unicodeLetters, 'Họ không hợp lệ, nên nhập ký tự (a-z)')
      .required('Vui lòng nhập Họ và tên người nhận.'),
    address: yup
      .string()
      .max(256, 'Nhiều nhất 256 ký tự.')
      .required('Vui lòng nhập Địa chỉ giao hàng.'),
    status: yup.string().required('Vui lòng chọn Tình trạng đơn hàng.'),
  });

  return (
    <div className="screen-body mb-4 p-3">
      <FormComponent
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        className="form-register"
      >
        {
          //! orderId
        }
        {!isAdminController && (
          <InputComponent
            readOnly={isAdminController ? false : true}
            disabled={isAdminController ? false : true}
            name="orderId"
            label={'Mã đơn hàng'}
          />
        )}
        {
          //! userId
        }
        <InputComponent
          readOnly={isAdminController ? false : true}
          disabled={isAdminController ? false : true}
          name="userId"
          label={isAdminController ? 'Mã người mua hộ' : 'Mã khách hàng'}
        />
        {
          //! orderDate
        }
        {!isAdminController && (
          <InputComponent
            readOnly
            disabled
            name="orderDate"
            label={'Ngày lập đơn hàng'}
          />
        )}
        {
          //! name
        }
        <InputComponent
          readOnly={isAdminController ? false : true}
          name="name"
          label={'Họ và tên người nhận'}
          // placeholder={'Họ và tên của bạn'}
        />
        {
          //! address
        }
        <InputComponent
          readOnly={isAdminController ? false : true}
          name="address"
          label={'Địa chỉ giao hàng'}
          // placeholder={'Địa chỉ của bạn'}
        />

        {
          //! status
        }
        <SelectControllerComponent
          className={'mb-4'}
          options={statusOptions}
          readOnly={isAdminController ? false : true}
          disabled={isAdminController ? false : true}
          name="status"
          label={'Tình trạng đơn hàng'}
        />
        {
          //! transactionNo
        }
        <InputComponent
          readOnly={isAdminController ? false : true}
          disabled={isAdminController ? false : true}
          name="transactionNo"
          label={'Mã giao dịch'}
        />
        {
          //! bankTranNo
        }
        <InputComponent
          readOnly={isAdminController ? false : true}
          disabled={isAdminController ? false : true}
          name="bankTranNo"
          label={'Mã giao dịch ngân hàng'}
        />
        {
          //! Button
        }
        {isAdminController && (
          <div className="d-flex justify-content-center">
            <Button className="btn-submit" variant="primary" type="submit">
              {loading
                ? 'Loading...'
                : orderId
                ? 'Cập nhật đơn hàng'
                : 'Tạo đơn hàng mới'}
            </Button>
            <Button
              className="btn ms-4"
              variant="secondary"
              onClick={handleClickCancel}
            >
              Hủy
            </Button>
          </div>
        )}
      </FormComponent>
    </div>
  );
};

export default OrderFormComponent;
