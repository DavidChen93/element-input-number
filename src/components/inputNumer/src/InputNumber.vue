/* eslint-disable */
<template>
  <div
    @dragstart.prevent
    :class="[
      'el-input-number',
      inputNumberSize ? 'el-input-number--' + inputNumberSize : '',
      { 'is-disabled': inputNumberDisabled }
    ]"
  >
    <el-input
      :maxlength="100"
      ref="input"
      :placeholder="placeholder"
      :value="displayValue"
      :disabled="inputNumberDisabled"
      :size="inputNumberSize"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @change="handleInputChange"
    ></el-input>
  </div>
</template>
<script>
import Focus from 'element-ui/src/mixins/focus'
import RepeatClick from 'element-ui/src/directives/repeat-click'

export default {
  name: 'elInputNumber',

  mixins: [Focus('input')],

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  directives: {
    repeatClick: RepeatClick
  },

  props: {
    step: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    value: {},
    disabled: Boolean,
    size: String,
    name: String,
    label: String,
    precision: {
      type: Number,
      default: 0,
      validator(val) {
        return val >= 0 && val === parseInt(val, 10)
      }
    },
    placeholder: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      currentValue: '', // 输入框的真实值
      userInput: null // 用于缓存用户输入，不做双向绑定
    }
  },

  computed: {
    numPrecision() {
      // 数字精确度，即精确到小数点后几位
      const { value, step, getPrecision, precision } = this
      const stepPrecision = getPrecision(step)
      if (precision !== undefined) {
        if (stepPrecision > precision) {
          console.warn(
            '[Element Warn][InputNumber]precision should not be less than the decimal places of step'
          )
        }
        return precision
      } else {
        return Math.max(getPrecision(value), stepPrecision)
      }
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },
    inputNumberSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
    },
    inputNumberDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },
    displayValue() {
      // 用户持续输入时，不计算页面展示值，直接返回
      if (this.userInput !== null) {
        return this.userInput
      }

      return this.formatValue(this.currentValue, this.precision)
    }
  },

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        let newVal = value === undefined || value === null || value === '' ? '' : Number(value)
        if (newVal !== undefined) {
          if (isNaN(newVal)) {
            return
          }
          if (this.precision !== undefined) {
            newVal = this.toPrecision(newVal, this.precision)
          }
        }
        if (newVal >= this.max) newVal = this.max
        if (newVal < this.min) newVal = this.min
        this.currentValue = newVal
        this.userInput = null
        this.$emit('input', newVal)
      }
    }
  },

  mounted() {
    let innerInput = this.$refs.input.$refs.input
    innerInput.setAttribute('role', 'spinbutton')
    innerInput.setAttribute('aria-valuemax', this.max)
    innerInput.setAttribute('aria-valuemin', this.min)
    innerInput.setAttribute('aria-valuenow', this.currentValue)
    innerInput.setAttribute('aria-disabled', this.inputNumberDisabled)
  },

  updated() {
    if (!this.$refs || !this.$refs.input) return
    const innerInput = this.$refs.input.$refs.input
    innerInput.setAttribute('aria-valuenow', this.currentValue)
  },

  methods: {
    formatValue(value, precision) {
      if (typeof value === 'number' && precision !== undefined) {
        let val = value.toFixed(precision)
        return val.split('.').length > 1
          ? val.split('.')[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + val.split('.')[1]
          : val.split('.')[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      } else if (typeof value === 'string' && precision !== undefined) {
        let val = value.replace(/,/g, '')
        val = this.toPrecision(val, precision)
        return val.split('.').length > 1
          ? val.split('.')[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + val.split('.')[1]
          : val.split('.')[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      }
    },
    toPrecision(num, precision) {
      if (precision === undefined) precision = this.numPrecision
      if (num === '' || num === null || num === undefined) return ''
      return Number(num).toFixed(precision)
    },
    getPrecision(value) {
      if (value === undefined) return 0
      const valueString = value.toString()
      const dotPosition = valueString.indexOf('.')
      let precision = 0
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1
      }
      return precision
    },
    handleBlur(event) {
      this.$emit('blur', event)
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    setCurrentValue(newVal) {
      const oldVal = this.currentValue
      if (typeof newVal === 'number' && this.precision !== undefined) {
        newVal = this.toPrecision(newVal, this.precision)
      } else if (typeof newVal === 'string' && this.precision !== undefined) {
        newVal = newVal.replace(/,/g, '')
        newVal = this.toPrecision(newVal, this.precision)
      }
      if (newVal >= this.max) newVal = this.toPrecision(this.max, this.precision)
      if (newVal < this.min) newVal = this.toPrecision(this.min, this.precision)
      if (oldVal === newVal) {
        return
      }

      this.userInput = null

      this.$emit('input', newVal)
      this.$emit('change', newVal, oldVal)

      this.currentValue = newVal
    },
    handleInput(value) {
      // 缓存用户输入
      this.userInput = value
    },
    handleInputChange(value) {
      value = value.replace(/,/g, '')
      const newVal = value === '' ? '' : Number(value)
      if (!isNaN(newVal) || value === '') {
        this.setCurrentValue(newVal)
      }

      this.userInput = null
    }
  }
}
</script>

<style>
.el-input-number .el-input__inner {
  padding: 0 15px;
}
</style>
