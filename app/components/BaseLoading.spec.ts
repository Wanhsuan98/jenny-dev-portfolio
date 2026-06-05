import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseLoading from './BaseLoading.vue'

describe('Component: BaseLoading.vue', () => {
  it('如果不傳入 message，應該只渲染轉圈圈的容器，不顯示文字', () => {
    const wrapper = mount(BaseLoading)

    // 檢查轉圈的 DOM 是否存在
    const spinner = wrapper.find('.animate-in.rounded-full')
    expect(spinner.exists()).toBe(true)

    // 因為沒傳入 message，p 標籤應該不存在
    const messageNode = wrapper.find('.page-subtitle')
    expect(messageNode.exists()).toBe(false)
  })

  it('如果傳入 message，應該在畫面上渲染出這段文字', () => {
    const messageText = '正在載入最新資料...'
    const wrapper = mount(BaseLoading, {
      props: {
        message: messageText,
      },
    })

    // 這次訊息標籤必須存在，且內容與傳入的一致
    const messageNode = wrapper.find('.page-subtitle')
    expect(messageNode.exists()).toBe(true)
    expect(messageNode.text()).toBe(messageText)
  })

  it('回歸測試：元件結構與快照必須與前次一致 (Snapshot Testing)', () => {
    const wrapper = mount(BaseLoading, {
      props: { message: '載入中...' },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
