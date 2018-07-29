<template>
  <f7-messagebar placeholder="Message" ref="messagebar">
    <input id="file-input" style="display: none;" type="file" @change="shareFile"/>
    <f7-link
      icon-if-ios="f7:share_fill"
      icon-if-md="material:attachment"
      slot="inner-start"
      onclick="document.getElementById('file-input').click()"
    ></f7-link>
    <f7-link
      icon-if-ios="f7:paper_plane_fill"
      icon-if-md="material:send"
      slot="inner-end"
      @click="sendMessage"
      title="Send"
      id="send-button"
      v-if="!sending"
    ></f7-link>
    <preloader v-else class="sending-loader"></preloader>
  </f7-messagebar>
</template>

<script>
  import { f7Link, f7Messagebar } from 'framework7-vue'
  import { mapGetters } from 'vuex'
  import * as R from 'ramda'

  import Preloader from './Preloader.vue'
  import { enableEmojiAutoComplete } from '../emoji'
  import { enableMentionAutoComplete } from '../mention'

  export default {
    components: {
      Preloader, f7Link, f7Messagebar
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
      this.textarea = this.$refs.messagebar.f7Messagebar.$textareaEl
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
