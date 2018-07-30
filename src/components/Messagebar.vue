<template>
  <div class="toolbar messagebar">
    <div class="toolbar-inner">
      <input id="file-input" style="display: none;" type="file" @change="shareFile"/>
      <a class="link" onclick="document.getElementById('file-input').click()" title="Share file">
        <i class="f7-icons ios-only">share_fill</i>
        <i class="material-icons md-only">attachment</i>
      </a>

      <div class="messagebar-area">
        <textarea placeholder="Message" id="messagebar-textarea"></textarea>
      </div>

      <a class="link" @click="sendMessage" title="Send" id="send-button" v-if="!sending">
        <i class="f7-icons ios-only">paper_plane_fill</i>
        <i class="material-icons md-only">send</i>
      </a>
      <preloader v-else class="sending-loader"></preloader>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as R from 'ramda'

import Preloader from './Preloader.vue'
import { enableEmojiAutoComplete } from '../emoji'
import { enableMentionAutoComplete } from '../mention'
import { Dom7 } from 'framework7'

export default {
  components: {
    Preloader
  },
  props: ['group'],
  data: function () {
    return {
      sending: false
    }
  },
  computed: {
    ...mapGetters(['getPersonNameById'])
  },
  async mounted () {
    this.textarea = Dom7('#messagebar-textarea')
    this.textarea.focus()
    this.textarea.on('keypress', (e) => {
      if (e.keyCode === 13) {
        if (!e.shiftKey) {
          e.preventDefault()
          document.getElementById('send-button').click()
        }
      }
    })
    this.textarea.on('paste', async (event) => {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      for (const item of items) {
        if (item.kind === 'file') {
          event.preventDefault()
          const file = item.getAsFile()
          if (!R.isNil(file)) {
            this.sending = true
            await this.$store.dispatch('shareFile', { groupId: this.$route.params.id, file })
            this.sending = false
          }
        }
      }
    })
    this.textarea.on('drop', async (event) => {
      const items = event.dataTransfer.items || []
      for (const item of items) {
        if (item.kind === 'file') {
          event.preventDefault()
          const file = item.getAsFile()
          if (!R.isNil(file)) {
            this.sending = true
            await this.$store.dispatch('shareFile', { groupId: this.$route.params.id, file })
            this.sending = false
          }
        }
      }
    })
    enableEmojiAutoComplete(this.textarea[0])
    enableMentionAutoComplete(this.textarea[0], this.group.members.map(id => ({ id, name: this.getPersonNameById(id) })))
  },
  methods: {
    async sendMessage () {
      if (this.textarea.val() === '') {
        return
      }
      const text = this.textarea.val()
      this.textarea.val('')
      this.textarea.trigger('change')
      this.sending = true
      await this.$store.dispatch('sendMessage', { groupId: this.$route.params.id, text })
      this.sending = false
    },
    async shareFile (e) {
      const file = e.target.files[0]
      this.sending = true
      await this.$store.dispatch('shareFile', { groupId: this.$route.params.id, file })
      this.sending = false
      e.target.value = ''
    },
    setText (text) {
      this.textarea.val(text)
      this.textarea.trigger('change')
      this.textarea.focus()
    }
  }
}
</script>
