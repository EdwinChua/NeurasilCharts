:: Set Project Location here 
set "projectLocation=D:\Node Projects\NeurasilCharts"

cd %projectLocation%

echo "Build charts library"
cmd /C ng build neurasil-charts


echo "Copying Files"
cmd /C  xcopy "%projectLocation%\dist" "%projectLocation%\staticLibraryFiles" /s /Y


echo "Complete"