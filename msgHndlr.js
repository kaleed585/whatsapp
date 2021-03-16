

const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const get = require('got')
const fetch = require('node-fetch')
const color = require('./lib/color')
const { spawn, exec } = require('child_process')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const { liriklagu, quotemaker, randomNimek, fb, sleep, jadwalTv, ss } = require('./lib/functions')
const { help, snk, info, donate, readme, listChannel } = require('./lib/help')
const exam = require ('./lib/exam') 
const { stdout } = require('process')
const nsfw_ = JSON.parse(fs.readFileSync('./lib/NSFW.json'))
const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'))
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg')
const { uploadImages } = require('./lib/fetcher')
const { 

    rugapoi,
    rugaapi,
   
} = require('./lib')




moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, isQuotedImage, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')
        const url = args.length !== 0 ? args[0] : ''
        const msgs = (message) => {
            if (command.startsWith('!')) {
                if (message.length >= 10){
                    return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const mess = {
            wait: '',
            error: {
                St: '',
                Qm: '',
                Yt3: '',
                Yt4: '',
               
            }
        }
        const apiKey = 'API-KEY' // apikey you can get it at https://mhankbarbar.tech/api
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const ownerNumber = ["966509803064@c.us","0509803064"] // replace with your whatsapp number
        const isOwner = ownerNumber.includes(sender.id)
        const isBlocked = blockNumber.includes(sender.id)
        const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
        //if (!isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
        //if (isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return
        //if (!isOwner) return
        switch(command) {
        case '!22sticker':
        case '!22stiker':
            if (isMedia && type === 'image') {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (args.length === 2) {
                const url = args[1]
                if (url.match(isUrl)) {
                    await client.sendStickerfromUrl(from, url, { method: 'get' })
                        .catch(err => console.log('Caught exception: ', err))
                } else {
                    client.reply(from, mess.error.Iv, id)
                }
            } else {
                    client.reply(from, mess.error.St, id)
            }
            break
        case '!22stickergif':
        case '!22stikergif':
        case '!22sgif':
            if (isMedia) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    const mediaData = await decryptMedia(message, uaOverride)
                    client.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
                    const filename = `./media/aswu.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                        const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                        await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                    })
                } else (
                    client.reply(from, '[❗] Kirim video dengan caption *!stickerGif* max 10 sec!', id)
                )
            }
           
            break
        case '!رابط':
            if (!isBotGroupAdmins) return client.reply(from, '??', id)
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
            } else {
            	client.reply(from, '???', id)
            }
         
           
            break
			
			case "revoke":
	if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
                    if (isBotGroupAdmins) {
                        client
                            .revokeGroupInviteLink(from)
                            .then((res) => {
                                client.reply(from, `Berhasil Revoke Grup Link gunakan *${prefix}grouplink* untuk mendapatkan group invite link yang terbaru`, id);
                            })
                            .catch((err) => {
                                console.log(`[ERR] ${err}`);
                            });
                    }
                    break;
					
			
			
			
        case '!منشن':
            if (!isGroupMsg) return client.reply(from, '???', id)
            if (!isGroupAdmins) return client.reply(from, '???', id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe = '-'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '-'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += ':)'
            await client.sendTextWithMentions(from, hehe)
            
        
		
		 
            break
			
		
        case '!الاحساء':
            
            if (!isGroupMsg) return client.reply(from, '2Al Ahssa Batch 18 Drive: https://drive.google.com/folderview?id=1-Play5rIPDPZIBGxy1aX68aUa-mnvBpi', id)
            if (args.length === 1) return client.reply(from, '2Al Ahssa Batch 18 Drive: https://drive.google.com/folderview?id=1-Play5rIPDPZIBGxy1aX68aUa-mnvBpi', id)
            if (!isGroupAdmins) return client.reply(from, '3Al Ahssa Batch 18 Drive: https://drive.google.com/folderview?id=1-Play5rIPDPZIBGxy1aX68aUa-mnvBpi', id)
            if (!isBotGroupAdmins) return client.reply(from, '4Al Ahssa Batch 18 Drive: https://drive.google.com/folderview?id=1-Play5rIPDPZIBGxy1aX68aUa-mnvBpi', id)
            try {
                await client.sendTextWithMentions(from,'Al Ahssa Batch 18 Drive: https://drive.google.com/folderview?id=1-Play5rIPDPZIBGxy1aX68aUa-mnvBpi')
            } catch {
                client.reply(from, mess.error.Ad, id)
            }
            break
       
	           case '!RT':
            
            if (!isGroupMsg) return client.reply(from, 'RT Batch 18 Drive:\n https://drive.google.com/drive/folders/1e-BimD8hdy4RbkWgxJtyBaD4qChoVhIc', id)
            if (args.length === 1) return client.reply(from, 'RT Batch 18 Drive:\n https://drive.google.com/drive/folders/1e-BimD8hdy4RbkWgxJtyBaD4qChoVhIc', id)
            if (!isGroupAdmins) return client.reply(from, 'RT Batch 18 Drive:\n https://drive.google.com/drive/folders/1e-BimD8hdy4RbkWgxJtyBaD4qChoVhIc', id)
            if (!isBotGroupAdmins) return client.reply(from, 'RT Batch 18 Drive:\n https://drive.google.com/drive/folders/1e-BimD8hdy4RbkWgxJtyBaD4qChoVhIc', id)
            try {
                await client.sendTextWithMentions(from,'RT Batch 18 Drive:\n https://drive.google.com/drive/folders/1e-BimD8hdy4RbkWgxJtyBaD4qChoVhIc')
            } catch {
                client.reply(from, mess.error.Ad, id)
            }
            break
	   
	   
	      case '!ريتايرد':
            
            if (!isGroupMsg) return client.reply(from, 'النطق: عمر اركب عليه  ', id)
            if (args.length === 1) return client.reply(from, 'النطق: عمر اركب عليه ', id)
            if (!isGroupAdmins) return client.reply(from, 'النطق: عمر اركب عليه ', id)
            if (!isBotGroupAdmins) return client.reply(from, 'النطق: عمر اركب عليه ', id)
            try {
                await client.sendTextWithMentions(from,'النطق: عمر اركب عليه ')
            } catch {
                client.reply(from, mess.error.Ad, id)
            }
            break
        case '!التوزيع':
            client.sendText(from, help)
            break
        
		 case '!الاختبارات':
            client.sendText(from, info)
            break
			
			
        case 'whatanime':
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'جاري البحث ...', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                	if (resolt.docs && resolt.docs.length <= 0) {
                		client.reply(from, 'اعتذر, لم استطع التعرف على الأنمي.', id)
                	}
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                    	teks = ',لست متأكدا من النتيجه'
                    }
                    teks += `\n الأسم بالياباني:* : ${title}\n *الأسم بالصيني:* : ${title_chinese}\n *الأسم بالروماجي* : ${title_romaji}\n *الأسم بالانقليزي* : ${title_english}\n`
                    teks += `➸ *18+?* : ${is_adult}\n`
                    teks += `➸ *الحلقه:* : ${episode.toString()}\n`
                    teks += `➸ *الدقه:* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    client.sendFileFromUrl(from, video, 'anime.mp4', teks, id).catch(() => {
                        client.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    client.reply(from, 'اعتذر, لقد حدث خطأ!', id)
                })
            } else {
				client.reply(from, `طريقة الأستخدام غير صحيحه, يرجى ارسال صوره مع الأمر.`, id)
			}
			
			
			break
			
			 case '!ارقام': {
            const loadedMsg = await client.getAmountOfLoadedMessages()
            const chatIds = await client.getAllChatIds()
            const groups = await client.getAllGroups()
            client.sendText(from, `Status :\n- *${loadedMsg}* Loaded Messages\n- *${groups.length}* Group Chats\n- *${chatIds.length - groups.length}* Personal Chats\n- *${chatIds.length}* Total Chats`)
            break
        }

			
			case '!اضافة':
			case '!اضافه':
            const orang = args[1]
            if (!isGroupMsg) return client.reply(from, 'عذرًا ، لا يمكن استخدام هذا الأمر إلا داخل المجموعة!', id)
            if (args.length === 1) return client.reply(from, '؟؟', id)
            if (!isGroupAdmins) return client.reply(from, 'ا يمكن استخدام هذا الأمر إلا من قبل مسؤولي المجموعة', id)
            if (!isBotGroupAdmins) return client.reply(from, 'رجى جعل البوت أدمن أولا', id)
            try {
                await client.addParticipant(from,`${orang}@c.us`)
            } catch {
                client.reply(from, mess.error.Ad, id)
            }
            break
			
			
			
			case '!ترقية':
			case '!ترقيه':
            if (!isGroupMsg) return client.reply(from, 'عذرًا ، لا يمكن استخدام هذا الأمر إلا داخل المجموعة!', id)
            if (!isGroupAdmins) return client.reply(from, 'ا يمكن استخدام هذا الأمر إلا من قبل مسؤولي المجموعة', id)
            if (!isBotGroupAdmins) return client.reply(from, 'رجى جعل البوت أدمن أولا', id)
            if (mentionedJidList.length === 0) return client.reply(from, '؟؟', id)
            if (mentionedJidList.length >= 2) return client.reply(from, '؟؟.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'عذرًا, هذا المستخدم مشرف,', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `تم اضافة @${mentionedJidList[0]} الى قاىمة المشرفين.`)
            break      
			
			
			
			case '!تخفيض':
           if (!isGroupMsg) return client.reply(from, 'عذرًا ، لا يمكن استخدام هذا الأمر إلا داخل المجموعة!', id)
            if (!isGroupAdmins) return client.reply(from, 'ا يمكن استخدام هذا الأمر إلا من قبل مسؤولي المجموعة', id)
            if (!isBotGroupAdmins) return client.reply(from, 'رجى جعل البوت أدمن أولا', id)
            if (mentionedJidList.length === 0) return client.reply(from, '؟؟', id)
            if (mentionedJidList.length >= 2) return client.reply(from, '؟؟', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'عذرًا, الامر مخصص للمشرفين فقط', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `تم ازاله @${mentionedJidList[0]} من قائمة المشرفين.`)
            break
			
        case '!طرد':
            if(!isGroupMsg) return client.reply(from, '...', message.id)
            if(!isGroupAdmins) return client.reply(from, 'You are not an admin, Sorry', message.id)
			
            if(!isBotGroupAdmins) return client.reply(from, 'You need to make me admin to use this CMD', message.id)
            if(mentionedJidList.length === 0) return client.reply(from, 'Wrong format', message.id)
            await client.sendText(from, `Request Accepted! issued:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await client.reply(from, '....', message.id)
                await client.removeParticipant(groupId, mentionedJidList[i])
			break	
            }
        }
		
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
