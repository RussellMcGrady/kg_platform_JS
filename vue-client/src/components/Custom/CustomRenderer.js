import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'

const HIGH_PRIORITY = 1500

const propertiesConfig = {
  'bpmn:StartEvent': {
    stroke: '#f6941d',
    fill: '#f6941d',
    strokeWidth: 4
  },
  'bpmn:UserTask': {
    stroke: '#3366cc',
    strokeWidth: 2
  },
  'bpmn:SubProcess': {
    stroke: '#3366cc',
    strokeWidth: 2
  },
  'bpmn:CallActivity': {
    stroke: '#3366cc',
    strokeWidth: 2
  },
  'bpmn:ExclusiveGateway': {
    stroke: '#59b9c6'
  },
  'bpmn:SequenceFlow': {
    fill: '#59b9c6',
    strokeWidth: 1,
    stroke: '#59b9c6'
  },
  'bpmn:EndEvent': {
    stroke: '#1f9baa',
    fill: '#1f9baa',
    strokeWidth: 1
  }
}

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY)

    this.bpmnRenderer = bpmnRenderer
  }

  canRender(element) {
    // ignore labels
    return !element.labelTarget
  }
  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element)
    setShapeProperties(shape, element) // 在此修改shape
    return shape
  }

  getShapePath(shape) {
    return this.bpmnRenderer.getShapePath(shape)
  }
}

function setShapeProperties(shape, element) {
  const type = element.type // 获取到的类型
  if (propertiesConfig[type]) {
    const properties = propertiesConfig[type]
    Object.keys(properties).forEach(prop => {
      shape.style.setProperty(prop, properties[prop])
    })
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer']
