from setuptools import setup, find_packages

setup(
    name='w_versioned_edgar_renderer',
    version='@VERSION@',
    description='An XBRL viewer produced and maintained by the SEC',
    long_description=open('README.md').read(),
    url='https://github.com/workiva/edgarrenderer',
    author='Workiva',
    author_email='dave.casleton@workiva.com',
    include_package_data=True,
    packages=find_packages(),
    classifiers=[
        'Development Status :: 1 - Active',
        'Intended Audience :: End Users/Desktop',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: Apache-2 License',
        'Natural Language :: English',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Operating System :: OS Independent',
    ],
)
