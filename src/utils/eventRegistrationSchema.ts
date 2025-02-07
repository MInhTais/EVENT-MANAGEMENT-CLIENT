import * as Yup from 'yup'

export const eventRegistrationSchema = Yup.object().shape({
  fullName: Yup.string().required('Họ và tên là bắt buộc'),
  password: Yup.string().required('Mật khẩu là bắt buộc'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
  gender: Yup.string().oneOf(['male', 'female', 'other'], 'Vui lòng chọn giới tính').required('Giới tính là bắt buộc'),
  email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại là bắt buộc')
})

export const eventActionSchema = Yup.object().shape({
  title: Yup.string().required('Tiêu đề là bắt buộc'),
  content: Yup.string().required('Nội dung là bắt buộc'),
  date: Yup.string().required('Ngày bắt đầu sự kiện là bắt buộc'),
  address: Yup.string().required('Địa chỉ là bắt buộc'),
  maxPersion: Yup.string().required('Số lượng người tham gia là bắt buộc')
})

export type Schema = Yup.InferType<typeof eventRegistrationSchema>
export type eventSchema = Yup.InferType<typeof eventActionSchema>
