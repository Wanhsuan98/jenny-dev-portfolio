import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBadge from './StatusBadge.vue'

describe('Component: StatusBadge.vue', () => {
  it('如果不傳入 status 或不匹配任何已知狀態，應該預設渲染出灰色的 secondary 標籤', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: undefined },
    })

    // 檢查預設值是否為 '-'
    expect(wrapper.text()).toBe('-')
    // 檢查是否包含預設的 css class
    expect(wrapper.classes()).toContain('badge-secondary')
  })

  it('如果傳入 Active 狀態，應該渲染出帶有成功色的標籤', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'Active' },
    })

    expect(wrapper.text()).toBe('Active')
    expect(wrapper.classes()).toContain('badge-success')
  })

  it('如果傳入 Error 狀態，應該渲染出帶有危險色的標籤', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'Error' },
    })

    expect(wrapper.text()).toBe('Error')
    expect(wrapper.classes()).toContain('badge-danger')
  })

  // 多個不同 prop 狀態組合的回歸測試
  it('回歸測試：確保不同狀態下的 DOM 結構與 class 組合沒有被意外更動', () => {
    // 把多種狀態一次放進一個 wrapper 中產生整合的對照圖
    const template = `
      <div>
        <StatusBadge status="Active" />
        <StatusBadge status="Error" />
        <StatusBadge status="Pending" />
        <StatusBadge status="Unknown" />
      </div>
    `
    const wrapper = mount({
      components: { StatusBadge },
      template,
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
