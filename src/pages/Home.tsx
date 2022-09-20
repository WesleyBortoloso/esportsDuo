import '../styles/main.css';
import * as Dialog from '@radix-ui/react-dialog';
import * as CheckBox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import logoImg from '../assets/logo.svg';
import { GameBanner } from '../components/GameBanner';
import { CreateAdBanner } from '../components/CreateAdBanner';
import { useEffect, useState, FormEvent } from 'react';
import { GameProps } from '../model/GameProps';
import { Check, GameController } from 'phosphor-react';
import { Label } from '../components/Form/Label';
import { Input } from '../components/Form/Input';
import axios from 'axios';
import { toast } from 'react-toastify';

function Home() {
  const [games, setGames] = useState<GameProps[]>([])
  const [weekDays, setWeekDays] = useState<string[]>([])
  const [useVoiceChannel, setuseVoiceChannel] = useState(false)
  const [open, setOpen] = useState(false);


  useEffect(() => {
    axios('http://localhost:3333/games')
      .then(response => {
        setGames(response.data.slice(3))
      })
  }, [])

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)

    if (!data.name) {
      return
    }

    try {
      await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel: useVoiceChannel
      })
      setOpen(false)
      toast.success('Anúncio criado com sucesso!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      return (
        toast.error('Houve um erro ao criar o anúncio!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      )
    }
  }

  const Modal = (
    <Dialog.Portal>
      <Dialog.Overlay className='bg-black/60 inset-0 fixed' />
      <Dialog.Content className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black'>
        <Dialog.Title className='text-3xl text-white font-black'>Publique um anúncio</Dialog.Title>
        <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='game' content='Qual o game?' />
            <select id='game' name='game' defaultValue='' className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'
            >
              <option disabled value="">Selecione o game que deseja jogar</option>
              {games.map(game => {
                return (
                  <option key={game.id} value={game.id}>{game.title}</option>
                )
              })}
            </select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='name' content='Seu nome (ou nickname)' />
            <Input name='name' id='name' placeholder='Como te chamam dentro do game?' />
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='yearsPlaying' content='Joga há quantos anos?' />
              <Input name='yearsPlaying' id='yearsPlaying' type="number" placeholder='Tudo bem ser ZERO' />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='discord' content='Qual seu Discord?' />
              <Input id='discord' name='discord' type="text" placeholder='Usuario#0000' />
            </div>
          </div>
          <div className='flex gap-6'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='weekDays' content='Quando costuma jogar?' />

              <ToggleGroup.Root className='grid grid-cols-4 gap-2' type="multiple" onValueChange={setWeekDays} value={weekDays}>
                <ToggleGroup.Item value='0' className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`} title="Domingo">D</ToggleGroup.Item>
                <ToggleGroup.Item value='1' className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Segunda'>S</ToggleGroup.Item>
                <ToggleGroup.Item value='2' className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Terça'>T</ToggleGroup.Item>
                <ToggleGroup.Item value='3' className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Quarta'>Q</ToggleGroup.Item>
                <ToggleGroup.Item value='4' className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Quinta'>Q</ToggleGroup.Item>
                <ToggleGroup.Item value='5' className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Sexta'>S</ToggleGroup.Item>
                <ToggleGroup.Item value='6' className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Sábado'>S</ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
            <div className='flex flex-col gap-2 flex-1'>
              <Label htmlFor='hourStart' content='Qual horário do dia?' />
              <div className='grid grid-cols-2 gap-2'>
                <Input id='hourStart' name='hourStart' type="time" placeholder='De' />
                <Input id='hourEnd' name='hourEnd' type="time" placeholder='Até' />
              </div>
            </div>
          </div>

          <label className='mt-2 flex gap-2 text-sm items-center'>
            <CheckBox.Root checked={useVoiceChannel} onCheckedChange={(checked) => { if (checked === true) { setuseVoiceChannel(true) } else { setuseVoiceChannel(false) } }} className='w-6 h-6 p-1 rounded bg-zinc-900'>
              <CheckBox.Indicator>
                <Check className='w-4 h-4 text-emerald-400' />
              </CheckBox.Indicator>
            </CheckBox.Root>
            Costumo me conectar ao chat de voz
          </label>

          <footer className='mt-4 flex justify-end gap-4'>
            <Dialog.Close type="button" className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'>Cancelar</Dialog.Close>
            <button type="submit" className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600'>
              <GameController size={24} />
              Encontrar duo
            </button>
          </footer>
        </form>
      </Dialog.Content>
    </Dialog.Portal >
  )

  return (
    <>
      <div className='max-w-[1344px] mx-auto flex flex-col items-center my-20'>
        <img src={logoImg} alt="Imagem referenciando a logo da empresa" />
        <h1 className="text-6xl text-white font-black mt-20">Seu <span className='bg-nlw-gradient text-transparent bg-clip-text'>duo</span> está aqui.</h1>
        <div className='grid grid-cols-6 gap-6 mt-16'>
          {games.map(game => {
            return (
              <GameBanner
                key={game.id}
                bannerUrl={game.bannerUrl}
                title={game.title}
                adsCount={game._count.ads} />
            )
          })}
        </div>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <CreateAdBanner />
          {Modal}
        </Dialog.Root>
      </div>
    </>
  )
}

export default Home
