<template lang="pug">
#tree
  sortable-tree(:data="data", childrenAttr="children", mixinParentKey="$parent")
    template(slot-scope="{ item }")
      div(v-if="item.name !== undefined")
        input(
          type="number",
          :value.number="item.hasChild() ? item.totalPoint() : item.point",
          @input="item.point = parseInt($event.target.value)",
          :disabled="item.hasChild()"
        )
        input(type="text", v-model="item.name")
        span
          button(@click="item.addChild()") &plus;
          button(@click="item.$parent.removeChild(item)") &times;
  textarea(v-model="dump")
</template>

<script lang="ts">
import Vue from 'vue'
import SortableTree from 'vue-sortable-tree'

interface RawData {
  name: string
  point: number
  children: Array<RawData>
}

class Data {
  public name = ''
  public point = 10
  public children: Array<Data> = []

  hasChild (): boolean {
    return this.children.length > 0
  }

  totalPoint (): number {
    if (this.children.length === 0) {
      return this.point
    }
    return this.children.reduce((acc, child) => {
      acc += child.totalPoint()
      return acc
    }, 0)
  }

  addChild (): void {
    this.children.push(new Data())
  }

  removeChild (target: Data): void {
    const idx = this.children.findIndex(child => child === target)
    this.children.splice(idx, 1)
  }

  static from ({ name, point, children }: RawData): Data {
    const self = new Data()
    self.name = name
    self.point = point
    self.children = children.map(child => Data.from(child))
    return self
  }
}

const data = new Data()

export default Vue.extend({
  name: 'Tree',
  components: {
    [SortableTree.name]: SortableTree
  },
  data () {
    return {
      data
    }
  },
  computed: {
    dump: {
      get (): string {
        return JSON.stringify(this.data, (k, v) => {
          if (k === '$parent') {
            return undefined
          }
          return v
        }, '  ')
      },
      set (value: string): void {
        this.data = Data.from(JSON.parse(value))
      }
    }
  }
})
</script>

<style lang="stylus" scoped>
#tree
  padding: 1rem
</style>
