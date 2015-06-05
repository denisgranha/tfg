#!/usr/bin/env python

import SimpleITK as sitk
import sys

# Parametro 1: path imagen.dcm
# Parametro 2: numero de pasos para algoritmo de reduccion de ruido
# Parmetro 3: path fichero de salida

if len(sys.argv) < 4:
    print("python noise.py original_image steps_alg final_image")
else:
    reader = sitk.ImageFileReader()
    reader.SetFileName ( sys.argv[1] )
    image = reader.Execute()
    pixelID = image.GetPixelIDValue()

    imgSmooth = sitk.CurvatureFlow(image1=image,
                                   timeStep=float(sys.argv[2]),
                                   numberOfIterations=5)

    caster = sitk.CastImageFilter()
    caster.SetOutputPixelType( pixelID )
    image = caster.Execute( imgSmooth )

    writer = sitk.ImageFileWriter()
    writer.SetFileName (sys.argv[3])
    writer.Execute ( image );
    #sitk.WriteImage(image,"image.dcm")
