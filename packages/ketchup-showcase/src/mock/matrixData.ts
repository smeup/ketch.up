export default JSON.parse(`
{
    "type": "EXB",
    "key": "i123",
    "title": "la mia matice ",
    "options": {
      "EXB": {
        "": {
          "enableSort": true
        },
        "A01": {
          "showFilter": true
        }
      },
      "CHA": {
        "": {
          "type": "BAR"
        }
      }
    },
    "data": {
      "columns": [
        {
          "name": "nome della colonna -> code",
          "title": "titolo -> text",
        },
        {
          "name": "FLD1",
          "title": "column 2",
        }
      ],
      "rows": [
        {
          "object": "se presente, il K01",
          "readOnly": true,
          "cells": {
            "FLD1": {
              "readOnly": true,
              "obj": {
                "t": "CN",
                "p": "COL",
                "k": "KEKBUR"
              },
              "style": "",
              "type": "itx / acp / etc...",
              "value": "mickey mouse"
            },
            "FLD2": {
              "value": "value 2"
            }
          }
        }
      ]
    },
    "messages": [],
    "actions": {
      "row": [
        {
          "exec": "...",
          "icon": "mdi-clock",
          "text": "Scheda orologio"
        }
      ],
      "global": [],
      "auto (tag action attuale)": [
        "F() / CLOSE / ETC...",
        "F() / CLOSE / ETC...",
        "F() / CLOSE / ETC...",
        "F() / CLOSE / ETC..."
      ],
      "command": [
        {
          "exec": "...",
          "icon": "mdi-play",
          "text": "Spotify"
        }
      ]
    },
    "variables": [],
    "dynamisms": []
  }`);
