import type { Song } from '../types';

export const SONGS: Song[] = [
  {
    title: 'Knockin\' on Heaven\'s Door',
    artist: 'Bob Dylan',
    tempo: 70,
    timeSignature: [4, 4],
    chords: [
      { chord: 'G Major', duration: 4, lyrics: 'Mama, take this badge off of me' },
      { chord: 'D Major', duration: 4, lyrics: '' },
      { chord: 'A Minor', duration: 4, lyrics: 'I can\'t use it anymore' },
      { chord: 'A Minor', duration: 4, lyrics: '' },
      { chord: 'G Major', duration: 4, lyrics: 'It\'s gettin\' dark, too dark to see' },
      { chord: 'D Major', duration: 4, lyrics: '' },
      { chord: 'C Major', duration: 4, lyrics: 'Feel I\'m knockin\' on heaven\'s door' },
      { chord: 'C Major', duration: 4, lyrics: '' },
    ],
  },
  {
    title: 'Wonderwall',
    artist: 'Oasis',
    tempo: 87,
    timeSignature: [4, 4],
    chords: [
      { chord: 'E Minor', duration: 4, lyrics: 'Today is gonna be the day' },
      { chord: 'G Major', duration: 4, lyrics: 'That they\'re gonna throw it back to you' },
      { chord: 'D Major', duration: 4, lyrics: 'By now you should\'ve somehow' },
      { chord: 'A Minor', duration: 4, lyrics: 'Realized what you gotta do' },
      { chord: 'E Minor', duration: 4, lyrics: 'I don\'t believe that anybody' },
      { chord: 'G Major', duration: 4, lyrics: 'Feels the way I do' },
      { chord: 'D Major', duration: 4, lyrics: 'About you now' },
      { chord: 'A Minor', duration: 4, lyrics: '' },
    ],
  },
  {
    title: 'Let It Be',
    artist: 'The Beatles',
    tempo: 72,
    timeSignature: [4, 4],
    chords: [
      { chord: 'C Major', duration: 4, lyrics: 'When I find myself in times of trouble' },
      { chord: 'G Major', duration: 4, lyrics: 'Mother Mary comes to me' },
      { chord: 'A Minor', duration: 4, lyrics: 'Speaking words of wisdom' },
      { chord: 'E Major', duration: 4, lyrics: 'Let it be' },
      { chord: 'C Major', duration: 4, lyrics: 'And in my hour of darkness' },
      { chord: 'G Major', duration: 4, lyrics: 'She is standing right in front of me' },
      { chord: 'A Minor', duration: 4, lyrics: 'Speaking words of wisdom' },
      { chord: 'E Major', duration: 4, lyrics: 'Let it be' },
    ],
  },
  {
    title: 'Horse with No Name',
    artist: 'America',
    tempo: 120,
    timeSignature: [4, 4],
    chords: [
      { chord: 'E Minor', duration: 4, lyrics: 'On the first part of the journey' },
      { chord: 'D Major', duration: 4, lyrics: '' },
      { chord: 'E Minor', duration: 4, lyrics: 'I was looking at all the life' },
      { chord: 'D Major', duration: 4, lyrics: '' },
      { chord: 'E Minor', duration: 4, lyrics: 'There were plants and birds and rocks and things' },
      { chord: 'D Major', duration: 4, lyrics: '' },
      { chord: 'E Minor', duration: 4, lyrics: 'There was sand and hills and rings' },
      { chord: 'D Major', duration: 4, lyrics: '' },
    ],
  },
  {
    title: 'Stand By Me',
    artist: 'Ben E. King',
    tempo: 118,
    timeSignature: [4, 4],
    chords: [
      { chord: 'A Major', duration: 4, lyrics: 'When the night has come' },
      { chord: 'A Major', duration: 4, lyrics: 'And the land is dark' },
      { chord: 'E Major', duration: 4, lyrics: 'And the moon is the only light we\'ll see' },
      { chord: 'E Major', duration: 4, lyrics: '' },
      { chord: 'A Major', duration: 4, lyrics: 'No I won\'t be afraid' },
      { chord: 'A Major', duration: 4, lyrics: 'Oh, I won\'t be afraid' },
      { chord: 'E Major', duration: 4, lyrics: 'Just as long as you stand' },
      { chord: 'A Major', duration: 4, lyrics: 'Stand by me' },
    ],
  },
  {
    title: 'Sweet Home Alabama',
    artist: 'Lynyrd Skynyrd',
    tempo: 100,
    timeSignature: [4, 4],
    chords: [
      { chord: 'D Major', duration: 2, lyrics: 'Big wheels keep on turning' },
      { chord: 'C Major', duration: 2, lyrics: '' },
      { chord: 'G Major', duration: 4, lyrics: 'Carry me home to see my kin' },
      { chord: 'D Major', duration: 2, lyrics: 'Singing songs about the southland' },
      { chord: 'C Major', duration: 2, lyrics: '' },
      { chord: 'G Major', duration: 4, lyrics: 'I miss Alabama once again' },
    ],
  },
];

export const getSongByTitle = (title: string): Song | undefined => {
  return SONGS.find(song => song.title.toLowerCase() === title.toLowerCase());
};
