import { getContext } from '@keystone-6/core/context'
import config from './keystone'
import * as PrismaModule from '.myprisma/client'

type PersonProps = {
  name: string
}
const persons: PersonProps[] = [
  { name: 'Lucy Wroblewski' },
  { name: 'Ches Adebayor' },
  { name: 'Tiff Jayden' },
  { name: 'Henrique Urrea' },
]

type TaskProps = {
  label: string
  isComplete: boolean
  finishBy: string
  assignedTo: string
  priority: 'low' | 'medium' | 'high'
}

const tasks: TaskProps[] = [
  {
    label: 'Install Keystone in local dev 🧪',
    isComplete: true,
    finishBy: '2021-01-01T02:30:00.000Z',
    assignedTo: 'Lucy Wroblewski',
    priority: 'high',
  },
  {
    label: 'Model the content💡',
    isComplete: true,
    finishBy: '2021-01-22T05:43:51.000Z',
    assignedTo: 'Ches Adebayor',
    priority: 'high',
  },
  {
    label: 'Architect the data schema 🔗',
    isComplete: true,
    finishBy: '2021-02-02T20:02:37.000Z',
    assignedTo: 'Lucy Wroblewski',
    priority: 'high',
  },
  {
    label: 'Design the UI 💅🏼',
    isComplete: true,
    finishBy: '2021-02-24T22:17:07.000Z',
    assignedTo: 'Tiff Jayden',
    priority: 'medium',
  },
  {
    label: 'Publish the content 📝',
    isComplete: true,
    finishBy: '2021-03-01T05:41:37.000Z',
    assignedTo: 'Ches Adebayor',
    priority: 'low',
  },
  {
    label: 'Query content over GraphQL🔎',
    isComplete: false,
    finishBy: '2021-03-21T05:41:37.000Z',
    assignedTo: 'Lucy Wroblewski',
    priority: 'medium',
  },
  {
    label: 'Implement the UI design in code 🖼',
    isComplete: false,
    finishBy: '2021-03-23T05:41:37.000Z',
    assignedTo: 'Henrique Urrea',
    priority: 'medium',
  },
  {
    label: 'Deploy Keystone backend to the web ☁️',
    isComplete: false,
    finishBy: '2021-03-30T05:41:37.000Z',
    assignedTo: 'Lucy Wroblewski',
    priority: 'low',
  },
  {
    label: 'Launch project 🚀',
    isComplete: false,
    finishBy: '2021-04-01T05:41:37.000Z',
    assignedTo: 'Lucy Wroblewski',
    priority: 'low',
  },
]

export async function main () {
  const context = getContext(config, PrismaModule)

  console.log(`🌱 Inserting seed data`)
  const createPerson = async (personData: PersonProps) => {
    let person = await context.query.Person.findOne({
      where: { name: personData.name },
      query: 'id',
    })

    if (!person) {
      person = await context.query.Person.createOne({
        data: personData,
        query: 'id',
      })
    }
  }

  const createTask = async (taskData: TaskProps) => {
    const persons = await context.query.Person.findMany({
      where: { name: { equals: taskData.assignedTo } },
      query: 'id',
    })

    await context.query.Task.createOne({
      data: { ...taskData, assignedTo: { connect: { id: persons[0].id } } },
      query: 'id',
    })
  }

  for (const person of persons) {
    console.log(`👩 Adding person: ${person.name}`)
    await createPerson(person)
  }
  for (const task of tasks) {
    console.log(`🔘 Adding task: ${task.label}`)
    await createTask(task)
  }

  console.log(`✅ Seed data inserted`)
  console.log(`👋 Please start the process with \`npm run dev\``)
}

main()
