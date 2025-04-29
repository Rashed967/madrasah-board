interface IStatusDialog {
    isOpen: boolean
    type: 'success' | 'error' | 'info'
    title: string
    message: string
  }
export default IStatusDialog